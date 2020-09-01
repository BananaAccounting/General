import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15
import QtQuick.Window 2.15

ApplicationWindow {
    title: "My Application"
    width: 640
    height: 480
    visible: true

    Button {
        text: "Push Me"
        anchors.centerIn: parent
    }
}