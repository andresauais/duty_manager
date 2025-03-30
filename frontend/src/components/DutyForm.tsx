import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Duty } from '../models/Duty';

type DutyFormProps = {
  onSubmit: (name: string, id?: number) => void;
  initialValue?: Duty;
};

export const DutyForm = ({ onSubmit, initialValue }: DutyFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({ name: initialValue.name });
    } else {
      form.resetFields();
    }
  }, [initialValue, form]);

  const handleFinish = (values: { name: string }) => {
    onSubmit(values.name.trim(), initialValue?.id);
    form.resetFields();
  };

  return (
    <Form
			form={form}
			layout="inline"
			onFinish={handleFinish}
			className="duty-form"
		>
			<Form.Item
				name="name"
				rules={[{ required: true, message: 'Please enter a duty name' }]}
				className="duty-form-input"
			>
				<Input placeholder="Enter duty name" />
			</Form.Item>

			<Form.Item>
				<Button type="primary" size="large" htmlType="submit">
					Add
				</Button>
			</Form.Item>

			<Form.Item>
				<Button htmlType="button" size="large" onClick={() => form.resetFields()}>
					Reset
				</Button>
			</Form.Item>
		</Form>
  );
};
