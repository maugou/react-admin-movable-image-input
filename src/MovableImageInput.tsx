//@ts-nocheck
import React, {
  FunctionComponent,
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from "react";
import { Labeled, InputHelperText } from "react-admin";
import { shallowEqual } from "react-redux";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import classnames from "classnames";
import { useInput, useTranslate, InputProps } from "ra-core";
import { MovableImageInputPreview } from "./MovableImageInputPreview";

/**
 * react-admin2/packages/ra-ui-materialui의 FileInput 코드를 그대로 복사하여 수정함
 */

const useStyles = makeStyles(
  (theme) => ({
    dropZone: {
      background: theme.palette.background.default,
      cursor: "pointer",
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.getContrastText(theme.palette.background.default),
    },
    preview: {
      display: "inline-block",
    },
    removeButton: {},
    root: { width: "100%" },
  }),
  { name: "RaFileInput" }
);

export interface FileInputProps {
  accept?: string;
  labelMultiple?: string;
  labelSingle?: string;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
}

export interface FileInputOptions extends DropzoneOptions {
  inputProps?: any;
  onRemove?: Function;
}

export const MovableImageInput: FunctionComponent<
  FileInputProps & InputProps<FileInputOptions>
> = (props) => {
  const {
    accept,
    children,
    className,
    classes: classesOverride,
    format,
    helperText,
    label,
    labelMultiple = "ra.input.file.upload_several",
    labelSingle = "ra.input.file.upload_single",
    maxSize,
    minSize,
    multiple = false,
    options: {
      inputProps: inputPropsOptions,
      ...options
    } = {} as FileInputOptions,
    parse,
    placeholder,
    resource,
    source,
    validate,
    ...rest
  } = props;
  const translate = useTranslate();
  const classes = useStyles(props);

  // turn a browser dropped file structure into expected structure
  const transformFile = (file: any) => {
    if (!(file instanceof File)) {
      return file;
    }

    const { source, title } = (Children.only(children) as ReactElement<
      any
    >).props;

    const preview = URL.createObjectURL(file);
    const transformedFile = {
      rawFile: file,
      [source]: preview,
    };

    if (title) {
      transformedFile[title] = file.name;
    }

    return transformedFile;
  };

  const transformFiles = (files: any[]) => {
    if (!files) {
      return multiple ? [] : null;
    }

    if (Array.isArray(files)) {
      return files.map(transformFile);
    }

    return transformFile(files);
  };

  const {
    id,
    input: { onChange, value, ...inputProps },
    meta,
    isRequired,
  } = useInput({
    format: format || transformFiles,
    parse: parse || transformFiles,
    source,
    type: "file",
    validate,
    ...rest,
  });
  const { touched, error } = meta;
  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  const onDrop = (newFiles: any, rejectedFiles: any, event: any) => {
    const updatedFiles = multiple ? [...files, ...newFiles] : [...newFiles];

    if (multiple) {
      onChange(updatedFiles);
    } else {
      onChange(updatedFiles[0]);
    }

    if (options.onDrop) {
      options.onDrop(newFiles, rejectedFiles, event);
    }
  };

  const onRemove = (file: any) => () => {
    if (multiple) {
      const filteredFiles = files.filter(
        (stateFile) => !shallowEqual(stateFile, file)
      );
      onChange(filteredFiles as any);
    } else {
      onChange(null);
    }

    if (options.onRemove) {
      options.onRemove(file);
    }
  };

  const onMove = (file: any) => (offset: number) => {
    const index = files.indexOf(file);
    const newIndex = index + offset;

    if (newIndex > -1 && newIndex < files.length) {
      let copiedFiles = [...files];
      const removedElement = copiedFiles.splice(index, 1)[0];
      copiedFiles.splice(newIndex, 0, removedElement);

      onChange(copiedFiles);
    }
  };

  const childrenElement: any = isValidElement(Children.only(children))
    ? (Children.only(children) as ReactElement<any>)
    : undefined;

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    accept,
    maxSize,
    minSize,
    multiple,
    onDrop,
  });

  return (
    <Labeled
      id={id}
      label={label}
      className={classnames(classes.root, className)}
      source={source}
      resource={resource}
      isRequired={isRequired}
      meta={meta}
    >
      <>
        <div
          data-testid="dropzone"
          className={classes.dropZone}
          {...getRootProps()}
        >
          <input
            id={id}
            {...getInputProps({
              ...inputProps,
              ...inputPropsOptions,
            })}
          />
          {placeholder ? (
            placeholder
          ) : multiple ? (
            <p>{translate(labelMultiple)}</p>
          ) : (
            <p>{translate(labelSingle)}</p>
          )}
        </div>
        <FormHelperText>
          <InputHelperText
            touched={touched}
            error={error}
            helperText={helperText}
          />
        </FormHelperText>
        {children && (
          <div className="previews">
            {files.map((file, index) => (
              <MovableImageInputPreview
                key={index}
                file={file}
                onMove={onMove(file)}
                onRemove={onRemove(file)}
                className={classes.removeButton}
              >
                {cloneElement(childrenElement, {
                  record: file,
                  className: classes.preview,
                })}
              </MovableImageInputPreview>
            ))}
          </div>
        )}
      </>
    </Labeled>
  );
};
