import { TableCell, TableHead, TableRow } from "@mui/material";
import { IEnhancedTableHead } from "models/table";

export const EnhancedTableHead = (props: IEnhancedTableHead) => {
  const { headCells } = props;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id}>{headCell.name}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
