/**
 * Generic JSON → Astro Component Renderer
 *
 * Single function that every page uses. Reads "component" key from JSON,
 * looks up the atom in the registry, spreads all props. Recursive for children.
 *
 * JSON is flat props (canonical pattern). No grouped content/visual/animation.
 * Schema validator ensures only valid enum values reach here.
 *
 * Usage in .astro:
 *   import { componentRegistry, renderTree } from '../../lib/render';
 *
 *   // In template:
 *   {renderTree(data, componentRegistry)}
 */

// ─── Component Registry ───
// Maps JSON "component" names to Astro component imports.
// Every atom must be registered here.

import { Page } from '../components/atoms/Page';
import { Section } from '../components/atoms/Section';
import { Grid } from '../components/atoms/Grid';
import { Heading } from '../components/atoms/Heading';
import { Text } from '../components/atoms/Text';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { Icon } from '../components/atoms/Icon';
import { Image } from '../components/atoms/Image';
import { Link } from '../components/atoms/Link';
import { List } from '../components/atoms/List';
import { LottieIcon } from '../components/atoms/LottieIcon';
import { Tooltip } from '../components/atoms/Tooltip';
import { FormField } from '../components/atoms/FormField';
import { Shape } from '../components/atoms/Shape';

export const componentRegistry: Record<string, any> = {
  Page, Section, Grid, Heading, Text, Badge, Button, Card,
  Icon, Image, Link, List, LottieIcon, Tooltip, FormField, Shape,
};

// ─── Props extraction ───
// Separates structural keys (component, children, text) from component props.

// Structural keys are stripped from props — they control the render tree, not the component.
// 'text' is NOT structural — it was moved to content-* props on each atom.
const STRUCTURAL_KEYS = new Set(['component', 'children']);

function extractProps(item: Record<string, any>): Record<string, any> {
  const props: Record<string, any> = {};
  for (const [key, value] of Object.entries(item)) {
    if (!STRUCTURAL_KEYS.has(key)) {
      props[key] = value;
    }
  }
  return props;
}

// ─── Render functions ───
// These return Astro component nodes. renderTree is the entry point.

export interface RenderNode {
  component: string;
  children?: RenderNode[];
  [key: string]: any;
}

/**
 * Render a single component node. Returns { Component, props, slotText, children }.
 * The .astro file uses this to build the actual JSX.
 */
export function resolveNode(
  node: RenderNode,
  registry: Record<string, any>
): { Component: any; props: Record<string, any>; children: RenderNode[] } | null {
  const Component = registry[node.component];
  if (!Component) return null;

  return {
    Component,
    props: extractProps(node),
    children: node.children || [],
  };
}
