'use client';

import { useState } from 'react';
import { selectMemberSchema } from '@planino/database/schema';
import { Euro, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import {
  clearMember,
  deleteMember,
  duplicateMember,
  updateMember,
} from 'actions/team';

import { RowWrapper } from 'components/row-wrapper';
import { DatePicker } from 'components/table/date-picker';
import { TableInput } from 'components/table/input';

type MemberSelect = z.infer<typeof selectMemberSchema>;

type RowProps = {
  member: MemberSelect;
};

export const Row = ({
  member: {
    memberId,
    name,
    createdAt,
    updatedAt,
    startingMonth,
    endingMonth,
    salary,
    raisePercentage,
    role,
  },
}: RowProps) => {
  const [member, setMember] = useState({
    name,
    role,
    salary,
    raisePercentage,
    startingMonth,
    endingMonth,
  });

  const debounceMemberChange = useDebouncedCallback(
    async (
      field: keyof MemberSelect | 'name',
      value: string | number | Date,
    ) => {
      let formattedValue = value;
      if (value instanceof Date) {
        formattedValue = new Date(
          Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()),
        );
      }
      if (
        member.endingMonth &&
        field === 'startingMonth' &&
        formattedValue > member.endingMonth
      ) {
        toast.error(
          'Mjesec početka obračuna ne može biti nakon mjeseca kraja obračuna.',
        );
        return;
      }
      if (
        member.startingMonth &&
        field === 'endingMonth' &&
        formattedValue < member.startingMonth
      ) {
        toast.error(
          'Mjesec kraja obračuna ne može biti prije mjeseca početka obračuna.',
        );
        return;
      }
      if (field === 'salary' && (formattedValue as number) < 0) {
        toast.error('Iznos troška ne može biti negativan.');
        return;
      }
      if (
        (field === 'salary' && value === '') ||
        (field === 'raisePercentage' && value === '')
      ) {
        formattedValue = '0';
      }

      const updateData = {
        memberId,
        [field]: formattedValue,
      };

      try {
        await updateMember({
          ...updateData,
        });
      } catch (error) {
        toast.error('Neuspješno ažuriranje troška.');
      }
    },
    1_000,
  );

  return (
    <RowWrapper
      updatedAt={new Date(updatedAt ?? createdAt)}
      deleteAction={() => deleteMember(memberId)}
      clearAction={() => clearMember(memberId)}
      duplicateAction={() => duplicateMember(memberId)}
    >
      <div className="grid grid-cols-7 divide-x-[1px] border-x-[1px] [&>*]:border-0">
        <TableInput
          className="col-span-2"
          value={member.name ?? ''}
          onChange={(e) => {
            setMember({ ...member, name: e.target.value });
            debounceMemberChange('name', e.target.value);
          }}
        />
        <TableInput
          value={member.role ?? ''}
          onChange={(e) => {
            setMember({ ...member, role: e.target.value });
            debounceMemberChange('role', e.target.value);
          }}
        />
        <DatePicker
          date={member.startingMonth ?? undefined}
          setDate={(date) => {
            if (!date) return;

            setMember({ ...member, startingMonth: date });
            debounceMemberChange('startingMonth', date);
          }}
        />
        <DatePicker
          date={member.endingMonth ?? undefined}
          setDate={(date) => {
            if (!date) return;

            setMember({ ...member, endingMonth: date });
            debounceMemberChange('endingMonth', date);
          }}
        />
        <TableInput
          type="number"
          value={member.salary ?? ''}
          onChange={(e) => {
            setMember({ ...member, salary: e.target.value });
            debounceMemberChange('salary', e.target.value);
          }}
          icon={Euro}
        />
        <TableInput
          type="number"
          value={member.raisePercentage ?? ''}
          onChange={(e) => {
            setMember({ ...member, raisePercentage: e.target.value });
            debounceMemberChange('raisePercentage', e.target.value);
          }}
          icon={Percent}
        />
      </div>
    </RowWrapper>
  );
};
