import { FC } from 'react';
import { ArrowForward, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import useColumnValuesMessage from 'features/import/hooks/useColumnValuesMessage';
import { Msg, useMessages } from 'core/i18n';

export enum ExperimentalFieldTypes {
  ORGANIZATION = 'organization',
  TAG = 'tag',
  BASIC = 'basic',
}

interface ExperimentField {
  id: number;
  title: string;
  type: ExperimentalFieldTypes;
  needsMapping: boolean;
}

export interface ExperimentColumn {
  data: (number | string | null)[];
  id: number;
  title: string;
}

export interface ExperimentalMappingResults {
  numMappedTo: number;
  numPeople: number;
}

interface MappingRowProps {
  column: ExperimentColumn;
  currentlyMapping: number | null;
  isSelected: boolean;
  mappingResults: ExperimentalMappingResults | null;
  onCheck: (isChecked: boolean) => void;
  onMapValues: () => void;
  onSelectField: (id: number) => void;
  selectedZetkinFieldId: number;
  zetkinFields: ExperimentField[];
}

const MappingRow: FC<MappingRowProps> = ({
  column,
  currentlyMapping,
  isSelected,
  mappingResults,
  onCheck,
  onMapValues,
  onSelectField,
  selectedZetkinFieldId,
  zetkinFields,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const columnValuesMessage = useColumnValuesMessage(column.data);

  const selectedZetkinField = zetkinFields.find(
    (field) => field.id === selectedZetkinFieldId
  );

  const showColumnValuesMessage =
    !isSelected || !selectedZetkinField || !selectedZetkinField.needsMapping;
  const showNeedsMappingMessage =
    isSelected &&
    !mappingResults &&
    selectedZetkinField &&
    selectedZetkinField.needsMapping;
  const showMappingResultMessage =
    isSelected &&
    mappingResults &&
    selectedZetkinField &&
    selectedZetkinField.needsMapping;
  const showGreyBackground =
    currentlyMapping === column.id && showNeedsMappingMessage;

  return (
    <Box
      bgcolor={showGreyBackground ? theme.palette.transparentGrey.light : ''}
      display="flex"
      flexDirection="column"
      padding={1}
    >
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        width="100%"
      >
        <Box alignItems="center" display="flex">
          <Checkbox
            checked={isSelected}
            onChange={(ev, isChecked) => onCheck(isChecked)}
          />
          <Box
            bgcolor={theme.palette.transparentGrey.light}
            borderRadius={2}
            padding={1}
          >
            <Typography>{column.title}</Typography>
          </Box>
        </Box>
        <Box alignItems="center" display="flex" width="50%">
          <ArrowForward color="secondary" sx={{ marginRight: 1 }} />
          <FormControl fullWidth size="small">
            <InputLabel>
              <Msg id={messageIds.configuration.mapping.selectZetkinField} />
            </InputLabel>
            <Select
              disabled={!isSelected}
              label={messages.configuration.mapping.selectZetkinField()}
              onChange={(event) => {
                if (typeof event.target.value == 'number') {
                  onSelectField(event.target.value);
                }
              }}
              value={isSelected ? selectedZetkinFieldId : ''}
            >
              {zetkinFields.map((field) => (
                <MenuItem key={field.id} value={field.id}>
                  {field.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        marginLeft={5.5}
        minHeight="40px"
      >
        {showColumnValuesMessage && (
          <Typography color="secondary">{columnValuesMessage}</Typography>
        )}
        <Typography
          color={
            showNeedsMappingMessage ? theme.palette.warning.main : 'secondary'
          }
        >
          {showNeedsMappingMessage && (
            <Msg id={messageIds.configuration.mapping.notMapped} />
          )}
          {showMappingResultMessage && (
            <Msg
              id={
                selectedZetkinField.type == ExperimentalFieldTypes.ORGANIZATION
                  ? messageIds.configuration.mapping
                      .finishedMappingOrganizations
                  : messageIds.configuration.mapping.finishedMappingTags
              }
              values={{
                numMappedTo: mappingResults.numMappedTo,
                numPeople: mappingResults.numPeople,
              }}
            />
          )}
        </Typography>
        {(showNeedsMappingMessage || showMappingResultMessage) && (
          <Button
            endIcon={<ChevronRight />}
            onClick={onMapValues}
            variant="text"
          >
            <Msg id={messageIds.configuration.mapping.mapValuesButton} />
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default MappingRow;
