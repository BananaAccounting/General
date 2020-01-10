/* Last update: 2018-04-04 */

//Notification functionality
var app = (function () {
    "use strict";

    var app = {};

    // Initialization function (to be called from each page that needs notification)
    app.initialize = function () {

        /*
            Notification
        */
        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });


        // After initialization, expose a common notification function
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };

        // Hide the notification message
        app.clearNotification = function (header, text) {
           $('#notification-message').hide();
           $('#notification-message-error').hide();
        };

        /*
            Notification error
        */
        $('body').append(
            '<div id="notification-message-error">' +
                '<div class="padding">' +
                    '<div id="notification-message-error-close"></div>' +
                    '<div id="notification-message-error-header"></div>' +
                    '<div id="notification-message-error-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-error-close').click(function () {
            $('#notification-message-error').hide();
        });


        // After initialization, expose a common notification function
        app.showNotificationError = function (header, text) {
            $('#notification-message-error-header').text(header);
            $('#notification-message-error-body').text(text);
            $('#notification-message-error').slideDown('fast');
        };

        app.closeConfirmation = function () {
            $('#confirmation-message').hide();
        };

    };

    return app;
})();