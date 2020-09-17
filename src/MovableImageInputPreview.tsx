/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016-present, Francois Zaninotto, Marmelab
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//@ts-nocheck
import * as React from "react";
import { useEffect, ReactNode, FunctionComponent } from "react";
import { makeStyles } from "@material-ui/core";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import MoveForward from "@material-ui/icons/NavigateBefore";
import MoveBackward from "@material-ui/icons/NavigateNext";
import IconButton from "@material-ui/core/IconButton";
import { useTranslate } from "ra-core";

/**
 * react-admin2/packages/ra-ui-materialui의 FileInputPreview 코드를 복사하여 수정함
 */

const useStyles = makeStyles(
  (theme) => ({
    removeButton: {
      top: theme.spacing(1),
      right: theme.spacing(1),
      minWidth: theme.spacing(2),
      color: theme.palette.error.main,
    },
    moveForwardButton: {
      top: "auto",
      bottom: "0.5rem",
      left: "0.5rem",
      right: "auto",
      color: theme.palette.error.main,
    },
    moveBackwardButton: {
      top: "auto",
      bottom: "0.5rem",
      left: "auto",
      right: "0.5rem",
      color: theme.palette.error.main,
    },
    itemStyle: {
      display: "inline-block",
      position: "relative",
      float: "left",
      // minWidth: "100px",
      // maxWidth: "500px",
      // overflow: "auto",
      "& button": {
        position: "absolute",
        opacity: 0,
      },
      "&:hover button": {
        opacity: 1,
      },
    },
  }),
  { name: "RaFileInputPreview" }
);

interface Props {
  children: ReactNode;
  className?: string;
  classes?: object;
  onRemove: () => void;
  onMove: (offset: number) => void;
  file: any;
}

export const MovableImageInputPreview: FunctionComponent<Props> = (props) => {
  const {
    children,
    classes: classesOverride,
    className,
    onRemove,
    onMove,
    file,
    ...rest
  } = props;
  const classes = useStyles(props);
  const translate = useTranslate();

  useEffect(() => {
    return () => {
      const preview = file.rawFile ? file.rawFile.preview : file.preview;

      if (preview) {
        window.URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  return (
    <div className={classes.itemStyle} {...rest}>
      <IconButton
        className={classes.moveForwardButton}
        onClick={() => onMove(-1)}
      >
        <MoveForward />
      </IconButton>
      <IconButton
        className={classes.moveBackwardButton}
        onClick={() => onMove(1)}
      >
        <MoveBackward />
      </IconButton>
      <IconButton
        className={classes.removeButton}
        onClick={onRemove}
        aria-label={translate("ra.action.delete")}
        title={translate("ra.action.delete")}
      >
        <RemoveCircle />
      </IconButton>
      {children}
    </div>
  );
};

MovableImageInputPreview.defaultProps = {
  file: undefined,
};
