/** @jsxImportSource @emotion/react */
/* eslint-disable @next/next/no-img-element */
import {
  FieldProps
} from '@keystone-6/core/types';
import {
  Button
} from '@keystone-ui/button';
import {
  FieldContainer,
  FieldLabel,
  TextInput
} from '@keystone-ui/fields';
import {
  MinusCircleIcon,
  EditIcon
} from '@keystone-ui/icons';
import {
  controller
} from '@keystone-6/core/fields/types/json/views';
import {
  ComponentType,
  Fragment,
  useState
} from 'react';

import Select, {
  components,
  GroupBase,
  OptionProps,
  Props
} from 'react-select'
import {
  css as emCss
} from '@emotion/css';
// const _ = require('underscore');
const videoData = require('../../../videoData');

interface RelatedVideo {
  label: string;
  videoUrl: string;
  caption: string;
}

const styles = {
  form: {
    field: emCss `
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: emCss `
      width: 10%;
    `,
    input: emCss `
      width: 90%;
    `,
    button: emCss `
      margin: .4rem;
    `,
    select: emCss `
      position: relative;
      z-index: 100;
      min-width: 100%;
    `,
    option: emCss `
      display: flex!important;
      flex-direction: row;
      p {
        width: 50%;
      }
    `
  },
  list: {
    ul: emCss `
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: emCss `
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: emCss `
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: emCss `
      width: 40%;
    `,
    dataHref: emCss `
      width: 60%;
    `,
    optionButton: emCss `
      margin: 0 0 0 0.5rem;
    `,
  },
};

export const Field = ({
    field,
    value,
    onChange,
    autoFocus
  }: FieldProps < typeof controller > ) => {
    const [currentValue, setCurrentValue] = useState < RelatedVideo > ();
    const [videoCaption, setVideoCaption] = useState('');
    const [index, setIndex] = useState < number | null > (null);

    const currentVideos: RelatedVideo[] = value ? JSON.parse(value) : [];

    const onSubmitNewVideo = () => {
      if (onChange) {
        const newCaption = {
          caption: videoCaption
        };
        const newVideo = {
          ...currentValue,
          ...newCaption
        };

        const videosCopy = [...currentVideos, newVideo];
        onChange(JSON.stringify(videosCopy));
        onCancel();
      }
    };

    const onDeleteVideo = (index: number) => {
      if (onChange) {
        const videosCopy = [...currentVideos];
        videosCopy.splice(index, 1);
        onChange(JSON.stringify(videosCopy));
        onCancel();
      }
    };

    const onEditVideo = (index: number) => {
      if (onChange) {
        setIndex(index);
        setCurrentValue(currentVideos[index]);
        setVideoCaption(currentVideos[index].caption);
      }
    };

    const onUpdate = () => {
      if (onChange && index !== null && currentValue) {
        const updatedCaption = {
          caption: videoCaption
        };
        const updatedVideo = {
          ...currentValue,
          ...updatedCaption
        };

        const videosCopy = [...currentVideos, updatedVideo];
        onChange(JSON.stringify(videosCopy));
        onCancel();
      }
    };

    const onCancel = () => {
      setIndex(null);
      setCurrentValue(undefined);
      setVideoCaption('');
    };

    const CustomOptionComponent = (props: OptionProps) => {
    return (
      <div>        
            <div
              className={props.cx(
                {
                  option: true,
                },
                props.className
              ) + ' ' + styles.form.option}
              ref={props.innerRef}
              aria-disabled={props.isDisabled}
              {...props.innerProps}
            >
              <p>
                {props.children}
              </p>
              <img alt={`Thumbnail image for video with title "${props.label}"`} src={(props.data as any).thumbSm} />
            </div>
      </div>
      
    )
  }

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {onChange && (
        <Fragment>
          <div className={styles.form.field}>

            <Select
              id={field.path}
              isClearable
              autoFocus={autoFocus}
              options={videoData}
              isDisabled={onChange === undefined}
              onChange={(newValue, meta) => {setCurrentValue(newValue as RelatedVideo)}}
              value={currentValue}
              className={styles.form.select}
              components={{Option: CustomOptionComponent as ComponentType<OptionProps<RelatedVideo, boolean, GroupBase<RelatedVideo>>>}}
  
            />

          <br />
          {currentValue && (
            <div>
              <FieldLabel>Caption</FieldLabel>
              <TextInput
                type='text' 
                onChange={(e) => {setVideoCaption(e.target.value)}}
                value={videoCaption}
               />
            </div>
          )}
          <div style={{display: 'block'}}>
          {index !== null ? (
            <Fragment>
              <Button onClick={onUpdate} className={styles.form.button}>
                Update
              </Button>
              <Button onClick={onCancel} className={styles.form.button}>
                Cancel
              </Button>
            </Fragment>
          ) : (
            currentValue && (
              
              <Button tone='positive' onClick={onSubmitNewVideo} className={styles.form.button}>
              Add
              </Button>
            
            )
            )}
          </div>
          </div>
        </Fragment>
      )}
      <ul className={styles.list.ul}>
        {currentVideos.map((relatedLink: RelatedVideo, i: number) => {
          return (
            <li key={`related-link-${i}`} className={styles.list.li}>
              <div className={styles.list.data}>
                <div className={styles.list.dataLabel}>{relatedLink.label}</div>
                <div className={styles.list.dataLabel}>{relatedLink.caption}</div>
              </div>
              {onChange && (
                <div>
                  <Button
                    size="small"
                    onClick={() => onEditVideo(i)}
                    className={styles.list.optionButton}
                  >
                    <EditIcon size="small" color="blue" />
                  </Button>
                  <Button size="small" className={styles.list.optionButton}
                      onClick={() => onDeleteVideo(i)}>
                    <MinusCircleIcon
                      size="small"
                      color="red"
                    />
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </FieldContainer>
  );
};
