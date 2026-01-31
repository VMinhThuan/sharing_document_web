import { Tag } from "antd";

const StatusTag = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return { color: "orange", text: "Pending" };
      case "approved":
        return { color: "green", text: "Approved" };
      case "rejected":
        return { color: "red", text: "Rejected" };
      default:
        return { color: "default", text: status || "Unknown" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Tag color={config.color} className="uppercase font-semibold">
      {config.text}
    </Tag>
  );
};

export default StatusTag;
