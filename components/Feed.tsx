// components/Feed.tsx
import UIComponent from "./uiComponent";
import { component } from "@utils/component";

type FeedProps = {
  components: component[];
  likedComponents: component[];
  userid: string | null;
  onComponentSelect: (selectedComponent: component) => void;
};

const Feed: React.FC<FeedProps> = ({
  components,
  likedComponents,
  userid,
  onComponentSelect,
}) => {
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
          onComponentSelect={onComponentSelect}
        />
      ))}
    </div>
  );
};

export default Feed;
