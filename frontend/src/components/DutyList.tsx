import React from 'react';
import { DutyForm } from './DutyForm';
import { DutyItem } from './DutyItem';
import { List, Typography } from 'antd';
import { useDuties } from '../hooks/useDuties';

export const DutyList = () => {
  const {
    duties,
    loading,
    editing,
    handleCreateOrUpdate,
    handleEditSave,
    handleToggleComplete,
    handleDelete,
  } = useDuties();

  return (
    <div className="duty-list-container">
      <Typography.Title level={3}>Duties</Typography.Title>

      <DutyForm
        onSubmit={handleCreateOrUpdate}
        initialValue={editing ?? undefined}
      />

      <List
        bordered
        dataSource={duties}
        loading={loading}
        renderItem={(duty) => (
          <DutyItem
            key={duty.id}
            duty={duty}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onEditSave={handleEditSave}
          />
        )}
        locale={{ emptyText: undefined }}
        className="duty-list"
      />
    </div>
  );
};
