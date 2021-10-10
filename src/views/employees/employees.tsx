import { useEffect, useState } from "react";
import { getUsersList, updateLocalUsersList } from "../../services/users";
import { Button, Table, Modal } from "antd";
import { User } from "../../types/user";
import ActionsBar from "../../components/actions-bar/actions-bar";
import { Actions } from "../../enums/actions";
import ManageUsers from "../../components/manage-users/manage-users";

function Employees() {
  const [users, setUsersList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState(Actions.ADD);

  useEffect(() => {
    getUsersList().then((users: User[]) => {
      setUsersList(users);
    });
  }, []);

  const onAction = (user: User | null, type: Actions) => {
    switch (type) {
      case Actions.ADD:
        showModal(Actions.ADD);
        break;
      case Actions.EDIT:
        user && showModal(Actions.EDIT, user);
        break;
      case Actions.DELETE:
        user && deleteUser(user);
        break;
      default:
        console.log("UnexpectedAction");
        break;
    }
  };

  const deleteUser = (user: User) => {
    const usersList = [...users];
    const index = usersList.findIndex(
      (existingUser: User) => existingUser.id === user.id
    );
    if (index !== -1) {
      usersList.splice(index, 1);
      setUsersList(usersList);
      updateLocalUsersList(usersList);
    }
  };

  const showModal = (mode: Actions, user?: User) => {
    setMode(mode);
    user && setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = (user: User) => {
    const usersList: User[] = [...users];
    const index = usersList.findIndex(
      (localUser: User) => localUser.id === user.id
    );
    if (index !== -1) {
      usersList[index] = user;
    } else {
      usersList.push(user);
    }
    setUsersList(usersList);
    updateLocalUsersList(usersList);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setSelectedUser(undefined);
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a: User, b: User) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a: User, b: User) => a.last_name.localeCompare(b.last_name),
    },
    {
      title: "Office",
      dataIndex: ["office", "name"],
      sorter: (a: User, b: User) => a.office.name.localeCompare(b.office.name),
    },
    {
      title: "Publisher",
      dataIndex: ["publisher", "name"],
    },
    {
      title: "Actions",
      dataIndex: "",
      width: "120px",
      key: "x",
      render: (_: any, user: User) => (
        <ActionsBar action={(type: Actions) => onAction(user, type)} />
      ),
    },
  ];

  return (
    <>
      <div className="Employees_Heading">
        <Button type="primary" onClick={() => onAction(null, Actions.ADD)}>
          Add
        </Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" />
      {isModalVisible && (
        <Modal
          title={mode === Actions.ADD ? "Add user" : "Edit user"}
          onCancel={handleCancel}
          visible={isModalVisible}
          footer={null}
        >
          <ManageUsers
            mode={mode}
            onOk={handleOk}
            onCancel={handleCancel}
            user={selectedUser}
          />
        </Modal>
      )}
    </>
  );
}

export default Employees;
