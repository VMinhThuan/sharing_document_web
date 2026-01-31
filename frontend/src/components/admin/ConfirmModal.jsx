import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ConfirmModal = ({
  open,
  onOk,
  onCancel,
  title = "Confirm",
  content = "Are you sure?",
  okText = "Yes",
  cancelText = "No",
  okButtonProps = {},
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      title={title}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ ...okButtonProps, loading }}
      icon={<ExclamationCircleOutlined />}
      centered
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
