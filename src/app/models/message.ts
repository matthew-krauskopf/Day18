export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: Message[];

  username: string;
  pic: string;
  deletable: boolean;
  editable: boolean;
  tmstp: number;
}
