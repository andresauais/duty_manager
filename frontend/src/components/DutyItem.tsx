import React, { useState } from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { Duty } from '../models/Duty';
import classNames from 'classnames';

type DutyItemProps = {
  duty: Duty;
  onToggleComplete: (duty: Duty) => void;
  onDelete: (id: number) => void;
  onEditSave: (id: number, newName: string) => void;
};

export const DutyItem = ({
  duty,
  onToggleComplete,
  onDelete,
  onEditSave,
}: DutyItemProps) => {
  
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className={classNames('duty-item', { completed: duty.completed })}>
      {isEditing ? (
        <Form
          className="duty-inline-edit-form"
          layout="inline"
          onFinish={({ name }) => {
            onEditSave(duty.id!, name.trim());
            setIsEditing(false);
          }}
          initialValues={{ name: duty.name }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Name is required' }]}
            className="duty-item-form-input"
          >
            <Input
              className="duty-item-input"
              placeholder="Enter duty name"
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Space>
                <Button htmlType="submit" type="primary" size="large">
                  Save
                </Button>
                <Button
                  htmlType="button"
                  size="large"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </Space>
            )}
          </Form.Item>
        </Form>
      ) : (
        <>
          <Typography.Text>{duty.name}</Typography.Text>
          <Space>
            <Button size="large" onClick={() => onToggleComplete(duty)}>
              {duty.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </Button>
            <Button size="large" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button danger size="large" onClick={() => onDelete(duty.id!)}>
              Delete
            </Button>
          </Space>
        </>
      )}
    </div>
  );
};
