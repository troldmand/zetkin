import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import MappingRow from './MappingRow';
import messageIds from 'features/import/l10n/messageIds';
import { UIDataColumn } from 'features/import/utils/types';
import { updateColumn } from 'features/import/store';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { Msg, useMessages } from 'core/i18n';
import { useAppDispatch, useNumericRouteParams } from 'core/hooks';

interface MappingProps {
  columns: UIDataColumn[];
  columnIndexBeingConfigured: number | null;
  onConfigureStart: (columnIndex: number) => void;
  onDeselectColumn: () => void;
}

const Mapping: FC<MappingProps> = ({
  columns,
  columnIndexBeingConfigured,
  onConfigureStart,
  onDeselectColumn,
}) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const fields = useColumnOptions(orgId);
  const dispatch = useAppDispatch();

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexShrink={1}
      height="100%"
      overflow="hidden"
      padding={1}
    >
      <Typography sx={{ paddingBottom: 2, paddingX: 1 }} variant="h5">
        <Msg id={messageIds.configuration.mapping.header} />
      </Typography>
      <Box alignItems="center" display="flex" paddingBottom={1}>
        <Box paddingLeft={2} width="50%">
          <Typography variant="body2">
            {messages.configuration.mapping.fileHeader().toUpperCase()}
          </Typography>
        </Box>
        <Box paddingLeft={3.2} width="50%">
          <Typography variant="body2">
            {messages.configuration.mapping.zetkinHeader().toUpperCase()}
          </Typography>
        </Box>
      </Box>
      <Box flexGrow={1} sx={{ overflowY: 'scroll' }}>
        {columns.map((column, index) => {
          return (
            <Box key={index}>
              {index == 0 && <Divider />}
              <MappingRow
                column={column}
                isBeingConfigured={columnIndexBeingConfigured == index}
                onChange={(column) => {
                  dispatch(updateColumn([index, column]));
                }}
                onConfigureStart={() => onConfigureStart(index)}
                onDeselectColumn={onDeselectColumn}
                options={fields}
              />
              <Divider />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Mapping;
