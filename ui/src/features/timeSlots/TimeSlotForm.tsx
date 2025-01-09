import {
  Button,
  Checkbox,
  CheckboxProps,
  Collapse,
  DatePicker,
  DatePickerProps,
  Form,
  message,
  Select,
  Space,
  TimePicker,
  TimePickerProps,
} from "antd";
import { TimeSlotRequest } from "../../types/time-slot";
import { useState } from "react";
import { postTimeSlotAsync } from "../../services/timeSlot-service";

interface TimeSlotFormProps {
  onTimeSlotAdded: () => void;
  cars?: { value: number; label: string }[] | [];
  initialValues?: TimeSlotRequest | null;
}

function TimeSlotForm({
  initialValues,
  cars,
  onTimeSlotAdded,
}: TimeSlotFormProps) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;
  const [timeSlot, setTimeSlot] = useState<TimeSlotRequest>(
    initialValues ?? ({} as TimeSlotRequest)
  );

  const onReset = () => {
    form.resetFields();
  };

  const handleChangeDate: DatePickerProps["onChange"] = (_, dateString) => {
    setTimeSlot((prev) => ({ ...prev, date: dateString as string }));
  };
  const handleChangeStartTime: TimePickerProps["onChange"] = (time) => {
    const getHours = time.hour() < 9 ? "0" + time.hour() : time.hour();
    const getMinutes = time.minute() < 9 ? "0" + time.minute() : time.minute();
    const getSeconds = time.second() < 9 ? "0" + time.second() : time.second();
    const detailTime = `${getHours}:${getMinutes}:${getSeconds}`;
    setTimeSlot((prev) => ({ ...prev, startTime: detailTime }));
  };
  const handleChangeEndTime: TimePickerProps["onChange"] = (time) => {
    const getHours = time.hour() < 9 ? "0" + time.hour() : time.hour();
    const getMinutes = time.minute() < 9 ? "0" + time.minute() : time.minute();
    const getSeconds = time.second() < 9 ? "0" + time.second() : time.second();
    const detailTime = `${getHours}:${getMinutes}:${getSeconds}`;
    setTimeSlot((prev) => ({ ...prev, endTime: detailTime }));
  };

  const onFinish = async () => {
    try {
      if (isEdit) {
        console.log("��� ~ TimeSlotForm ~ onFinish ~ timeSlot:", timeSlot);
      } else {
        await postTimeSlotAsync(timeSlot);
      }
      form.resetFields();
      message.success("Time slot added successfully");

      onTimeSlotAdded(); // call the callback to reload time slots
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error(`Failed to add time slot: ${errorDetails}`);
    }
  };

  const handleChangeAvailable: CheckboxProps["onChange"] = (e) =>
    setTimeSlot((prev) => ({ ...prev, isAvailable: e.target.checked }));

  const formInput = () => {
    return (
      <Form
        form={form}
        onFinish={onFinish}
        name="control-hooks"
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="carId" label="Car Model" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select model"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value: number) =>
              setTimeSlot((prev) => ({ ...prev, carId: value }))
            }
            options={cars}
          />
        </Form.Item>
        <Form.Item name="date" label="Date" rules={[{ required: true }]}>
          <DatePicker onChange={handleChangeDate} />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true }]}
        >
          <TimePicker onChange={handleChangeStartTime} />
        </Form.Item>
        <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
          <TimePicker onChange={handleChangeEndTime} />
        </Form.Item>
        <Form.Item name="isAvailable" label="Is Available">
          <Checkbox onChange={handleChangeAvailable}>Available</Checkbox>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };
  return (
    <Collapse
      items={[
        {
          key: "1",
          label: "Time Slot Form",
          children: formInput(),
        },
      ]}
    />
  );
}

export default TimeSlotForm;
