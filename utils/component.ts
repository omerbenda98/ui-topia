export type component = {
  html: string;
  css: string;
  _id: string;
  type: string;
  userid: string | null;
  likedComponents: component[];
  likes: string[];
  onComponentSelect: (selectedComponent: component) => void;
};
