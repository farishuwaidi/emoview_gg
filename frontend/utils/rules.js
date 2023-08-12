export const rules = {
  roomId: [
    (v) =>
      !!/^[a-zA-Z]{3}-[a-zA-Z]{4}-[a-zA-Z]{3}$/.test(v) ||
      'Room ID is not valid. Example: abc-defg-hij',
  ],
  name: [(v) => !!v || 'Please fill out name field'],
  description: [(v) => !!v || 'Please fill out description field'],
}
