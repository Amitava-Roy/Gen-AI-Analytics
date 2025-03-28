class ResponseDto {
  constructor(data, message, resposeCode = 1) {
    this.data = data;
    this.message = message;
    this.resposeCode = resposeCode;
  }
}

module.exports = ResponseDto;
