export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: Message[];
  likedBy: number[];

  username: string;
  pic: string;
  deletable: boolean;
  editable: boolean;
  tmstp: number;
}
