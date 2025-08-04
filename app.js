//v3
(function (genesys) {
  'use strict';

  genesys.app.init({
    appId: 'YOUR_CLIENT_APP_ID', // Замените на ваш Client App ID
    ui: {
      visible: true,
      width: '300px',
      height: '200px'
    }
  }).then(function (app) {
    console.log('[RichCall] Приложение успешно инициализировано');

    // Подписка на событие изменения состояния разговора
    app.subscribe('conversationState', function (data) {
      console.log('[RichCall] Событие conversationState:', data);

      // Проверяем, что разговор активен и есть агент
      if (data.state === 'connected' && data.participants.some(p => p.purpose === 'agent')) {
        console.log('[RichCall] Разговор подключён, ищем номера...');

        let calledNumber = '';
        let callingNumber = '';

        // Извлекаем номера из участников
        data.participants.forEach(participant => {
          if (participant.direction === 'inbound' && participant.purpose === 'external') {
            callingNumber = participant.address || participant.addressFrom;
            console.log('[RichCall] Найден callingNumber:', callingNumber);
          }
          if (participant.direction === 'inbound' && participant.purpose === 'acd') {
            calledNumber = participant.addressTo || participant.address;
            console.log('[RichCall] Найден calledNumber:', calledNumber);
          }
        });

        // Проверка, найдены ли номера
        if (callingNumber && calledNumber) {
          // Формируем динамический URL
          const dynamicUrl = `https://app-eu.richcall.io/agent?phone=${encodeURIComponent(calledNumber)}&phone=${encodeURIComponent(callingNumber)}`;
          console.log('[RichCall] Сформирован URL:', dynamicUrl);

          // Открываем URL в новой вкладке
          try {
            window.open(dynamicUrl, '_blank');
            console.log('[RichCall] URL успешно открыт');
          } catch (error) {
            console.error('[RichCall] Ошибка при открытии URL:', error);
          }
        } else {
          console.warn('[RichCall] Не удалось найти номера для формирования URL');
        }
      }
    });

    // Обработка ошибок
    app.on('error', function (error) {
      console.error('[RichCall] Ошибка приложения:', error);
    });
  }).catch(function (error) {
    console.error('[RichCall] Ошибка инициализации:', error);
  });

})(window.genesys || {});