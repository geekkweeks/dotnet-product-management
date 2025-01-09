import { useEffect, useState } from "react";
import { getTimeSlotsAsync } from "../../services/timeSlot-service";
import { TimeSlotResponse } from "../../types/responses/timeSlot-response";
import {
  Button,
  Divider,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { IoTrashBinOutline } from "react-icons/io5";
import TimeSlotForm from "./TimeSlotForm";
import { getCarsAsync } from "../../services/product-service";

function TimeSlotsTable() {
  const [timeSlot, setTimeSlot] = useState<TimeSlotResponse[]>([]);
  const [cars, setCars] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: ["car", "brand"],
      key: "car.brand",
    },
    {
      title: "Model",
      dataIndex: ["car", "model"],
      key: "car.model",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Start",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Available",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable: boolean) => (
        <span>{isAvailable ? "Yes" : "No"}</span>
      ),
    },
    {
      title: "Actions",
      action: "action",
      render: (record: TimeSlotResponse) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => console.log(record?.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this time slot?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<IoTrashBinOutline />}
              danger
              onClick={() => console.log(record?.id)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchTimeSlots = async () => {
    try {
      const timeSlotResponse = await getTimeSlotsAsync(null);
      console.log("🚀 ~ fetchTimeSlots ~ timeSlotResponse:", timeSlotResponse);
      setTimeSlot(timeSlotResponse);
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error(`Failed to get time slot: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const carsResponse = await getCarsAsync();
      const transformedCars = carsResponse.map((car) => ({
        value: car.id as number,
        label: car.model as string,
      }));
      setCars(transformedCars);
    } catch (error: any) {
      console.error("mesages:", error);
      alert(`Failed to fetch cars ${error?.errors}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCars();
  }, []);
  useEffect(() => {
    fetchTimeSlots();
  }, []);
  return (
    <>
      <Table
        dataSource={timeSlot}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Divider />
      <TimeSlotForm cars={cars} onTimeSlotAdded={fetchTimeSlots} />
    </>
  );
}

export default TimeSlotsTable;
