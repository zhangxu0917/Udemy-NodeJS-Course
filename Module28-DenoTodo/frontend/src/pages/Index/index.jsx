import SubmitForm from "./form";
import TaskList from "./list";

const HomePage = () => {
  return (
    <div className="page-container">
      <SubmitForm />
      <TaskList />
    </div>
  );
};

export default HomePage;
