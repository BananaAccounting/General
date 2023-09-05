import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: dialog
    height: 400
    width: 600

    property alias text: textArea.text

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 5

        TextArea {
            id: textArea
            Layout.fillHeight: true
            Layout.fillWidth: true
            readOnly: true

            background: Rectangle {
               border.color: "gray"
               border.width: 1
               radius: 2.0
            }
        }

        RowLayout {
            Layout.alignment:  Qt.AlignRight | Qt.AlignBottom
            Layout.rightMargin: 0
            Layout.fillWidth: true

            Button {
                text: qsTr("Close")
                Shortcut {
                    sequence: StandardKey.Cancel
                    onActivated: Qt.quit()
                }
                onClicked: {
                    Qt.quit()
                }
            }
        }
    }
}
