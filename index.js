var SerialPort = require("serialport");

var myport = "";
// tìm kiếm theo pnpId
SerialPort.list().then((ports) => {
  ports.forEach(function (port) {
    var pnpId = "USB\\VID_0408&PID_EA26&MI_01\\6&30308331&0&0001";
    if (port.pnpId.toString() === pnpId.toString()) {
      myport = new SerialPort(`${port.path}`, {
        baudrRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        flowControl: false,
      });
      myport.on("open", onOpen);
      myport.on("error", onError);
      myport.on("data", onDataReceived);
      myport.on("close", onClose);
    }
  });
});

function onOpen(error) {
  if (!error) {
    console.log("Kết nối thành công");
    send(myport, "<phone>", "<msg>");
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
