export interface Message {
  author: number;
  uuid: string;
  text: string;
  comments: string[];
  likedBy: number[];
  parent: string | undefined;
  retwatAuthor: number | undefined;
  retwattedBy: number | undefined;

  username: string;
  retwatUsername: string | undefined;
  pic: string;
  deletable: boolean;
  editable: boolean;
  tmstp: number;
}
