export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: string[];
  likedBy: number[];
  parent: string | undefined;

  username: string;
  pic: string;
  deletable: boolean;
  editable: boolean;
  tmstp: number;
}
