export type User = {
  id: string,
  iconUrl: string | null,
  name: string | null,
}

export type Room = {
  id: string,
  size: number,
  activateBot?: boolean,
}

export type Vote = {
  point: number,
  user: User,
}

export type VoteDocument = {
  point: number,
  roomId: string,
  userIconUrl: string | null,
  userId: string,
  userName: string | null,
}
