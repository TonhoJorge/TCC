var StravaApiV3 = require('strava_api_v3');
var defaultClient = StravaApiV3.ApiClient.instance;

// Configura o token de acesso OAuth2 para autorização: strava_oauth
var strava_oauth = defaultClient.authentications['strava_oauth'];
strava_oauth.accessToken = "SEU TOKEN DE ACESSO";

var api = new StravaApiV3.ActivitiesApi();

var id = 789; // {Long} O identificador da atividade.

var opts = { 
  'includeAllEfforts': true // {Boolean} Incluir todos os esforços do segmento.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    const response = data;

    // Função para formatar uma data em uma string legível
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    }

    const totalTime = response.elapsed_time;
    const startTime = formatDate(response.start_date);
    const endTime = formatDate(response.end_date);
    const totalDistance = response.distance;
    const averageSpeed = response.average_speed;
    const maxSpeed = response.max_speed;
    const elevationGain = response.total_elevation_gain;

    // Obter o ID do usuário atual usando a API getLoggedInAthlete()
    var apiAthletes = new StravaApiV3.AthletesApi();

    var callbackAthletes = function(errorAthletes, dataAthletes, responseAthletes) {
      if (errorAthletes) {
        console.error(errorAthletes);
      } else {
        const athleteData = JSON.parse(dataAthletes);
        const currentUserId = athleteData.id; // Obter o ID do usuário atual

        // Obter o saldo de pontos e a última data de treino do usuário no banco de dados
        User.findByPk(currentUserId)
          .then(user => {
            if (user) {
              var pointsBalance = user.pointsBalance;
              var lastTrainingDate = user.lastTrainingDate;

              const currentDate = new Date();
              const startDate = new Date(response.start_date);
              const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));

              var continuityMultipliers = [1, 2, 3, 4, 5, 6, 7];
              var decreaseMultiplier = 2; // Multiplicador para diminuir nos dias não treinados

              // Calcular o nível atual e o multiplicador de continuidade
              var level = 0;
              var continuityMultiplier = 0;
              var trainingDays = 0;

              // Verificar se a data de treino atual é consecutiva à última data de treino
              if (lastTrainingDate) {
                const lastTraining = new Date(lastTrainingDate);
                const daysSinceLastTraining = Math.floor((currentDate - lastTraining) / (1000 * 60 * 60 * 24));

                // Se a data de treino atual for consecutiva, atualizar a última data de treino e aumentar o contador de dias de treino
                if (daysSinceLastTraining === 1) {
                  trainingDays = daysSinceLastTraining;
                  lastTrainingDate = response.start_date;
                }
              } else {
                // Se não houver última data de treino, definir a última data de treino como a data de treino atual e aumentar o contador de dias de treino
                lastTrainingDate = response.start_date;
                trainingDays = 1;
              }

              // Calcular o nível atual e o multiplicador de continuidade com base no contador de dias de treino
              if (trainingDays > 0) {
                level = Math.floor((trainingDays - 1) / 7) + 1;
                continuityMultiplier = continuityMultipliers[Math.min(level - 1, continuityMultipliers.length - 1)];
              }
         
              var earnedPoints = ((continuityMultiplier * ((totalDistance * averageSpeed)/2)) + ((maxSpeed + elevationGain)*4)/100);

              pointsBalance += earnedPoints;

              console.log("Tempo total da atividade: " + totalTime + " segundos");
              console.log("Data e hora de início: " + startTime);
              console.log("Data e hora de término: " + endTime);
              console.log("Distância total: " + totalDistance + " metros");
              console.log("Velocidade média: " + averageSpeed + " metros por segundo");
              console.log("Velocidade máxima: " + maxSpeed + " metros por segundo");
              console.log("Ganho de elevação: " + elevationGain + " metros");
              console.log("Saldo de pontos: " + pointsBalance);

              user.pointsBalance = pointsBalance;
              user.lastTrainingDate = lastTrainingDate;
              user.save()
                .then(() => {
                  console.log("Saldo de pontos e última data de treino atualizados no banco de dados");
                })
                .catch(error => {
                  console.error("Erro ao atualizar o saldo de pontos e a última data de treino no banco de dados:", error);
                });
            } else {
              console.error('Usuário não encontrado');
            }
          })
          .catch(error => {
            console.error('Erro ao obter usuário do banco de dados:', error);
          });
      }
    };

    apiAthletes.getLoggedInAthlete(callbackAthletes);
  }
};

api.getActivityById(id, opts, callback);

