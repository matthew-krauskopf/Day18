export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: string[];
  likedBy: number[];
  parent: string | undefined;
  retwatAuthor: number | undefined;
  retwattedBy: number[];

  username: string;
  retwatUsername: string | undefined;
  pic: string;
  deletable: boolean;
  editable: boolean;
  tmstp: number;
}
