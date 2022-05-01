export type User = {
  id: string,
  iconUrl: string | null,
  name: string | null,
}

export type Room = {
  id: string,
  size: number,
}

export type Vote = {
  point: number,
  user: User,
}

export type VoteDocument = {
  point: number,
  roomId: number,
  userIconUrl: string,
  userId: string,
  userName: string,
}
