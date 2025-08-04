// app.js
(function (genesys) {
  'use strict';

  // Инициализация приложения
  genesys.app.init({
    // Укажите Client App ID из шага 2
    appId: 'YOUR_CLIENT_APP_ID',
    // Опционально: настройки отображения
    ui: {
      visible: true,
      width: '300px',
      height: '200px'
    }
  }).then(function (app) {
    console.log('Приложение успешно инициализировано');

    // Подписка на события разговоров
    app.subscribe('conversationState', function (data) {
      // Проверяем, что оператор ответил на вызов
      if (data.state === 'connected' && data.participants.some(p => p.purpose === 'agent')) {
        // Извлекаем номера
        const participants = data.participants;
        let calledNumber = '';
        let callingNumber = '';

        participants.forEach(participant => {
          if (participant.purpose === 'external' && participant.direction === 'inbound') {
            callingNumber = participant.address; // Номер, с которого звонили (ANI)
          }
          if (participant.purpose === 'agent' || participant.direction === 'inbound') {
            calledNumber = participant.addressTo || participant.address; // Номер, на который звонили (DNIS)
          }
        });

        // Формируем динамический URL
        const dynamicUrl = `https://app-eu.richcall.io/agent?phone=${encodeURIComponent(calledNumber)}&phone=${encodeURIComponent(callingNumber)}`;

        // Открываем URL в новой вкладке
        window.open(dynamicUrl, '_blank');

        console.log('Открыт URL:', dynamicUrl);
      }
    });

    // Обработка ошибок
    app.on('error', function (error) {
      console.error('Ошибка приложения:', error);
    });
  }).catch(function (error) {
    console.error('Ошибка инициализации:', error);
  });

})(window.genesys || {});