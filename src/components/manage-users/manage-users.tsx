import { Actions } from "../../enums/actions";
import { Input, Select, Button, Spin } from "antd";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { getOfficesList } from "../../services/offices";
import { Office } from "../../types/office";
import { getPublishersList } from "../../services/publishers";
import { Publisher } from "../../types/publisher";
import { User } from "../../types/user";
const { Option } = Select;

interface ManageUsersProps {
  mode: Actions;
  onOk: Function;
  onCancel: Function;
  user?: User;
}
type ManageForm = {
  first_name: string;
  last_name: string;
  office: string;
  publisher: string;
};

function ManageUsers(props: ManageUsersProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [offices, setOfficesList] = useState<Office[]>([]);
  const [publishers, setPublishersList] = useState<Publisher[]>([]);
  const [initalValues, setInitalValues] = useState<ManageForm>({
    first_name: props.user ? props.user.first_name : "",
    last_name: props.user ? props.user.last_name : "",
    office: props.user?.office ? props.user.office.name : "",
    publisher: props.user?.publisher ? props.user.publisher.name : "",
  });

  useEffect(() => {
    const promises = [getOfficesList(), getPublishersList()];
    Promise.all(promises)
      .then((values) => {
        const offices: Office[] = values[0];
        const publishers: Publisher[] = values[1];

        setOfficesList(offices);
        if (!props.user) {
          const formData = { ...initalValues };
          formData.office = offices[0].name;
          setInitalValues(formData);
        }

        setPublishersList(publishers);
        setIsLoaded(true);
        generateId();
      })
      .catch((e: any) => console.log(e));
  }, []);

  const handleValidation = (values: ManageForm) => {
    const errors: any = {};
    // first name
    if (!values.first_name) {
      errors.first_name = "Required";
    } else if (values.first_name.length > 20) {
      errors.first_name = "Fist name length should be less then 20";
    }
    // last name
    if (!values.last_name) {
      errors.last_name = "Required";
    } else if (values.last_name.length > 20) {
      errors.last_name = "Last name length should be less then 20";
    }
    return errors;
  };

  const handleSubmit = (values: ManageForm) => {
    let office: Office;
    const existingOffice = offices.find(
      (office: Office) => office.name === values.office
    );
    if (existingOffice) {
      office = existingOffice;
    } else {
      office = offices[0];
    }

    const publisher: Publisher | undefined = publishers.find(
      (publisher: Publisher) => publisher.name === values.publisher
    );
    const user: User = {
      id: id,
      first_name: values.first_name,
      last_name: values.last_name,
      office: office,
      publisher: publisher ? publisher : null,
    };
    props.onOk(user);
  };

  const handleCancel = (): void => {
    props.onCancel();
  };

  const generateId = (): void => {
    const unicId = props.user?.id ? props.user.id : Date.now();
    setId(unicId);
  };

  return (
    <>
      {isLoaded ? (
        <div>
          <div className="ManageUsers_FormControl">
            <strong className="ManageUsers_FormLabel">Id</strong>
            {id}
          </div>
          <Formik
            initialValues={initalValues}
            validate={(values) => handleValidation(values)}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <label className="ManageUsers_FormControl">
                  <strong className="ManageUsers_FormLabel">First Name</strong>
                  <div className="ManageUsers_FormInput">
                    <Input
                      className="ManageUsers_FullWidth"
                      placeholder="John"
                      type="text"
                      name="first_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.first_name}
                    />
                    {errors.first_name && touched.first_name && (
                      <span className="ManageUser_FormError">
                        {errors.first_name}
                      </span>
                    )}
                  </div>
                </label>
                <label className="ManageUsers_FormControl">
                  <strong className="ManageUsers_FormLabel">Last Name</strong>
                  <div className="ManageUsers_FormInput">
                    <Input
                      placeholder="Doe"
                      type="text"
                      name="last_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.last_name}
                    />

                    {errors.last_name && touched.last_name && (
                      <span className="ManageUser_FormError">
                        {errors.last_name}
                      </span>
                    )}
                  </div>
                </label>

                <label className="ManageUsers_FormControl">
                  <strong className="ManageUsers_FormLabel">Office</strong>
                  <Select
                    className="ManageUsers_FullWidth"
                    onChange={(value: string) => setFieldValue("office", value)}
                    value={values.office}
                  >
                    {offices.map((office: Office) => (
                      <Option key={office.id} value={office.name}>
                        {office.name}
                      </Option>
                    ))}
                  </Select>
                </label>
                <label className="ManageUsers_FormControl">
                  <strong className="ManageUsers_FormLabel">Publisher</strong>
                  <Select
                    className="ManageUsers_FullWidth"
                    onChange={(value: string) =>
                      setFieldValue("publisher", value)
                    }
                    value={values.publisher}
                  >
                    {publishers.map((publisher: Office) => (
                      <Option key={publisher.id} value={publisher.name}>
                        {publisher.name}
                      </Option>
                    ))}
                  </Select>
                </label>
                <div className="ManageUsers_ButtonBar">
                  <Button
                    className="ManageUsers_Button"
                    type="primary"
                    htmlType="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                  <Button
                    className="ManageUsers_Button"
                    type="default"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <Spin />
      )}
    </>
  );
}

export default ManageUsers;
