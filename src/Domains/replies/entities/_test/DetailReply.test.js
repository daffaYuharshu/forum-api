const DetailReply = require("../DetailReply");

describe("a DetailReply entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      username: "dicoding",
      content: "content",
    };

    // Action & Assert
    expect(() => new DetailReply(payload)).toThrowError(
      "DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      username: "dicoding",
      content: true,
      date: "2021-08-08T07:19:09.775Z",
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError(
      "DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create detailReply object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "content",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
    };

    // Action
    const { id, content, date, username } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
