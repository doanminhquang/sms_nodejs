var SerialPort = require("serialport");

var port = new SerialPort("\\\\.\\COM9", {
  baudrRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.on("open", onOpen);
port.on("error", onError);
port.on("data", onDataReceived);
port.on("close", onClose);

function onOpen(error) {
  if (!error) {
    console.log("Kết nối thành công");
    send(port, "<sdt>", "<msg>");
  }
}

function onDataReceived(data) {
  console.log("Phản hồi: " + data);
}

function onError(error) {
  console.log(error);
}

function onClose(error) {
  console.log("Ngắt kết nối");
  console.log(error);
}

function send(serial, toPhone, message) {
  setTimeout(() => {
    serial.write("AT+CMGF=1\r");
    setTimeout(() => {
      serial.write(`AT+CMGS="${toPhone}"\r`);
      setTimeout(() => {
        serial.write(`${message}\r`);
        setTimeout(() => {
          serial.write("\x1A");
        }, 100);
      }, 100);
    }, 100);
  }, 100);
}
