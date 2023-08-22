import { SyntheticEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { DataService } from "../../services/data/DataService";

type CreateSpaceProps = {
  dataService: DataService;
};

type CustomEvent = {
  target: HTMLInputElement;
};

const CreateSpace = ({ dataService }: CreateSpaceProps) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [photo, setPhoto] = useState<File | undefined>();
  const [actionResult, setActionResult] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (name && location) {
      const id = await dataService.createSpace(name, location, photo);
      setActionResult(`Create space iwth id: ${id}`);
      setName("");
      setLocation("");
    } else {
      setActionResult("Please provide a name and a location!");
    }
  };

  const setPhotoUrl = (event: CustomEvent) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const renderPhoto = () => {
    if (photo) {
      const localPhotoUrl = URL.createObjectURL(photo);
      return <img alt="" src={localPhotoUrl} style={{ maxWidth: "200px" }} />;
    }
  };

  const renderForm = () => {
    if (!dataService.isAuthorized()) {
      return <NavLink to="/login">Please login</NavLink>;
    }
    return (
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>Name:</label>
        <br />
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Location:</label>
        <br />
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
        <br />
        <label>Photo:</label>
        <br />
        <input type="file" onChange={(e) => setPhotoUrl(e)} />
        <br />
        {renderPhoto()}
        <br />
        <input type="submit" value="Create Space" />
      </form>
    );
  };

  return (
    <div>
      {renderForm()}
      {actionResult ? <h3>{actionResult}</h3> : undefined}
    </div>
  );
};

export default CreateSpace;
