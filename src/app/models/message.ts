export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: Message[];

  username: string;
  pic: string;
}
