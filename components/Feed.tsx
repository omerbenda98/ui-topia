// components/Feed.tsx
import UIComponent from "./uiComponent";
import { component } from "@utils/component";

type FeedProps = {
  components: component[];
  likedComponents: component[];
  userid: string | null;
};

const Feed: React.FC<FeedProps> = ({ components, likedComponents, userid }) => {
  const likedComponentIds = likedComponents.map((comp) => comp._id);

  return (
    <div className="feed">
      {components.map((componentData, index) => (
        <UIComponent
          key={index}
          html={componentData.html}
          css={componentData.css}
          _id={componentData._id}
          type={componentData.type}
          userid={userid}
          likes={componentData.likes}
          likedComponents={likedComponents}
        />
      ))}
    </div>
  );
};

export default Feed;
