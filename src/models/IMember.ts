export interface IMember {
  uid: string | undefined,
  piece: "black" | "white",
  name: string,
  creator: boolean
}