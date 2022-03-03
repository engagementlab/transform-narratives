/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FieldProps } from '@keystone-6/core/types';
import { Button } from '@keystone-ui/button';
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { MinusCircleIcon, EditIcon } from '@keystone-ui/icons';
import { controller } from '@keystone-6/core/fields/types/json/views';
import { Fragment, useState } from 'react';

import Select, { components, OptionProps } from 'react-select'
import Image from 'next/image';
import { css as emCss } from '@emotion/css';
import { jsx, css } from '@emotion/react';
// const _ = require('underscore');
const videoData = require('../../../videoData');


interface RelatedLink {
  label: string;
  videoUrl: string;
}

const styles = {
  form: {
    field: emCss`
      align-items: center;
      width: 100%;
      margin: 1rem 0 0 0;
    `,
    label: emCss`
      width: 10%;
    `,
    input: emCss`
      width: 90%;
    `,
    button: emCss`
      margin: .4rem;
    `,
    select: emCss`
      position: relative;
      z-index: 100;
      min-width: 100%;
    `,
    option: css `
      display: flex!important;
      flex-direction: row;
      p {
        width: 50%;
      }
    `
  },
  list: {
    ul: emCss`
      list-style: none;
      margin: 1rem 0 0 0;
      padding: 0;
    `,
    li: emCss`
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      width: 100%;

      &:nth-of-type(2n) > div:nth-of-type(1) {
        background-color: white;
      }
    `,
    data: emCss`
      background-color: #eff3f6;
      padding: 0.5rem;
      flex: auto;
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    `,
    dataLabel: emCss`
      width: 40%;
    `,
    dataHref: emCss`
      width: 60%;
    `,
    optionButton: emCss`
      margin: 0 0 0 0.5rem;
    `,
  },
};

export const Field = ({ field, value, onChange, autoFocus }: FieldProps<typeof controller>) => {
  const [currentValue, setCurrentValue] = useState<RelatedLink>();
  const [videoUrl, setVideoUrl] = useState('');
  const [index, setIndex] = useState<number | null>(null);

  const relatedLinks: RelatedLink[] = value ? JSON.parse(value) : [];

  const onSubmitNewRelatedLink = () => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks, currentValue];
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onDeleteRelatedLink = (index: number) => {
    if (onChange) {
      const relatedLinksCopy = [...relatedLinks];
      relatedLinksCopy.splice(index, 1);
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onEditRelatedLink = (index: number) => {
    if (onChange) {
      setIndex(index);
      setCurrentValue(relatedLinks[index]);
      setVideoUrl(relatedLinks[index].videoUrl);
    }
  };

  const onUpdateRelatedLink = () => {
    if (onChange && index !== null && currentValue) {
      const relatedLinksCopy = [...relatedLinks];
      relatedLinksCopy[index] = currentValue!;
      onChange(JSON.stringify(relatedLinksCopy));
      onCancelRelatedLink();
    }
  };

  const onCancelRelatedLink = () => {
    setIndex(null);
    setCurrentValue(undefined);
    setVideoUrl('');
  };

  const CustomOptionComponent = (props: OptionProps) => {
    // const mergedStyles = Object.assign(, styles.form.option);
    return (
      <div>
            <div
              css={css(props.getStyles('option', props))}
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
              <img alt={`Thumbnail image for video with title "${props.label}"`} src={props.data.thumb} />
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
              onChange={(newValue, meta) => {setCurrentValue(newValue as RelatedLink)}}
              value={currentValue}
              className={styles.form.select}
              components={{Option: CustomOptionComponent}}
            />

          <br />
          <div style={{display: 'block'}}>
          {index !== null ? (
            <Fragment>
              <Button onClick={onUpdateRelatedLink} className={styles.form.button}>
                Update
              </Button>
              <Button onClick={onCancelRelatedLink} className={styles.form.button}>
                Cancel
              </Button>
            </Fragment>
          ) : (
            currentValue && (
              
              <Button tone='positive' onClick={onSubmitNewRelatedLink} className={styles.form.button}>
              Add
              </Button>
            
            )
            )}
          </div>
          </div>
        </Fragment>
      )}
      <ul className={styles.list.ul}>
        {relatedLinks.map((relatedLink: RelatedLink, i: number) => {
          return (
            <li key={`related-link-${i}`} className={styles.list.li}>
              <div className={styles.list.data}>
                <div className={styles.list.dataLabel}>{relatedLink.label}</div>
              </div>
              {onChange && (
                <div>
                  <Button
                    size="small"
                    onClick={() => onEditRelatedLink(i)}
                    className={styles.list.optionButton}
                  >
                    <EditIcon size="small" color="blue" />
                  </Button>
                  <Button size="small" className={styles.list.optionButton}>
                    <MinusCircleIcon
                      size="small"
                      color="red"
                      onClick={() => onDeleteRelatedLink(i)}
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
