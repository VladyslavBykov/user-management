import { Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Actions } from "../../enums/actions";
interface ActionsProps {
  action: Function;
}
function ActionsBar(props: ActionsProps) {
  return (
    <div className="Employees_Actions_Container">
      <Tooltip title="Edit">
        <Button
          type="primary"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => props.action(Actions.EDIT)}
        />
      </Tooltip>
      <Tooltip title="Delete">
        <Button
          type="primary"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => props.action(Actions.DELETE)}
        />
      </Tooltip>
    </div>
  );
}

export default ActionsBar;
