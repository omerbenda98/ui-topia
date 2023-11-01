import Nav from "@components/Nav";
import Provider from "@components/Provider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metaData = {
  title: "UI-topia",
  description: "Discover & share cool ui components",
};

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div>
      <div className="main">
        <div className="gradient" />
      </div>

      <main className="app">
        {/* <Nav /> */}
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
