import { Omit, Overwrite } from '@material-ui/types';
import {
  CreateCSSProperties,
  StyledComponentProps,
  WithStylesOptions,
} from '@material-ui/styles/withStyles';
import * as React from 'react';
import { DefaultTheme } from '../defaultTheme';

// We don't want a union type here (like React.ComponentType) in order to support mapped types.
export type StyledComponent<P extends {}> = (props: P) => React.ReactElement<P, any> | null;

export interface StyledOptions {
  filterProps?: string[];
}

export interface StyleGeneratorFunction<Theme, Props extends {}> {
  (props: { theme: Theme } & Props): CreateCSSProperties<Props>;
  filterProps?: string[];
}

/**
 * @internal
 */
export type ComponentCreator<Component extends React.ElementType> = <
  Theme = DefaultTheme,
  Props extends {} = React.ComponentPropsWithoutRef<Component>
>(
  styles: CreateCSSProperties<Props> | StyledOptions | StyleGeneratorFunction<Theme, Props>,
  options?: WithStylesOptions<Theme> | StyledOptions
) => StyledComponent<
  Omit<
    JSX.LibraryManagedAttributes<Component, React.ComponentProps<Component>>,
    'classes' | 'className'
  > &
    StyledComponentProps<'root'> &
    Overwrite<Props, { className?: string; theme?: Theme }>
>;

export interface StyledProps {
  className: string;
}

export default function styled<Component extends React.ElementType>(
  Component: Component
): ComponentCreator<Component>;
