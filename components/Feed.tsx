// components/Feed.tsx
import UIComponent from "./uiComponent";

type ComponentData = {
  html: string;
  css: string;
};

type FeedProps = {
  components: ComponentData[];
};

const Feed: React.FC<FeedProps> = ({ components }) => {
  return (
    <div className="feed">
      {components.map((componentData, index) => (
        <UIComponent
          key={index}
          html={componentData.html}
          css={componentData.css}
        />
      ))}
    </div>
  );
};

export default Feed;
