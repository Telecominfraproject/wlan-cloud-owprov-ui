import { useEffect, useMemo, useState } from 'react';
import { useGetResources } from 'hooks/Network/Resources';
import { InterfaceProps } from 'models/ConfigurationSections/Interfaces';
import { VariableBlock } from 'models/VariableBlock';

const findAllVariableBlocks = (interfaces: InterfaceProps[]) => {
  let variableBlocks: string[] = [];

  for (const interfc of interfaces) {
    if (interfc.vlan?.__variableBlock !== undefined && interfc.vlan?.__variableBlock[0] !== undefined)
      variableBlocks.push(interfc.vlan?.__variableBlock[0]);

    if (interfc.tunnel?.__variableBlock !== undefined && interfc.tunnel?.__variableBlock[0] !== undefined)
      variableBlocks.push(interfc.tunnel?.__variableBlock[0]);

    if (interfc.captive?.__variableBlock !== undefined && interfc.captive?.__variableBlock[0] !== undefined)
      variableBlocks.push(interfc.captive?.__variableBlock[0]);

    for (const ssid of interfc.ssids ?? []) {
      if (ssid.__variableBlock !== undefined && ssid.__variableBlock[0] !== undefined)
        variableBlocks.push(ssid.__variableBlock[0]);
      if (ssid.radius?.__variableBlock !== undefined && ssid.radius.__variableBlock[0] !== undefined)
        variableBlocks.push(ssid.radius.__variableBlock[0]);
    }
  }

  // Removing duplicates (if using the same variable blocks more than once)
  variableBlocks = [...new Set(variableBlocks)];
  return variableBlocks;
};

const getVariableValueFromArray = (id: string, variableBlocks: VariableBlock[]) => {
  const found: VariableBlock | undefined = variableBlocks.find((vBlock) => vBlock.id === id);
  if (found && found.variables[0]?.value !== undefined) {
    try {
      return JSON.parse(found.variables[0].value);
    } catch {
      return {
        __variableBlock: [id],
      };
    }
  }

  return {
    __variableBlock: [id],
  };
};

const replaceVariableBlocksWithContent = (interfaces: InterfaceProps[], variableBlocks: VariableBlock[]) => {
  const result: InterfaceProps[] = interfaces;

  for (const [i, interfc] of interfaces.entries()) {
    if (interfc.vlan?.__variableBlock !== undefined && interfc.vlan?.__variableBlock[0] !== undefined) {
      const value = getVariableValueFromArray(interfc.vlan?.__variableBlock[0], variableBlocks);
      // @ts-ignore
      result[i].vlan = value;
    }
    if (interfc.tunnel?.__variableBlock !== undefined && interfc.tunnel?.__variableBlock[0] !== undefined) {
      const value = getVariableValueFromArray(interfc.tunnel?.__variableBlock[0], variableBlocks);
      // @ts-ignore
      result[i].tunnel = value;
    }
    if (interfc.captive?.__variableBlock !== undefined && interfc.captive?.__variableBlock[0] !== undefined) {
      const value = getVariableValueFromArray(interfc.captive?.__variableBlock[0], variableBlocks);
      // @ts-ignore
      result[i].captive = value;
    }
    for (const [y, ssid] of interfc.ssids?.entries() ?? []) {
      if (ssid.__variableBlock !== undefined && ssid.__variableBlock[0] !== undefined) {
        const value = getVariableValueFromArray(ssid.__variableBlock[0], variableBlocks);
        // @ts-ignore
        result[i].ssids[y] = value;
      }
      if (ssid.radius?.__variableBlock !== undefined && ssid.radius.__variableBlock[0] !== undefined) {
        const value = getVariableValueFromArray(ssid.radius.__variableBlock[0], variableBlocks);
        // @ts-ignore
        result[i].ssids[y].radius = value;
      }
    }
  }
  return result;
};

const useInterfacesJsonDisplay = ({ interfaces, isOpen }: { interfaces?: InterfaceProps[]; isOpen: boolean }) => {
  const [variableBlockIds, setVariableBlockIds] = useState<string[]>([]);
  const { data: resources } = useGetResources({ select: variableBlockIds });

  useEffect(() => {
    if (isOpen && interfaces) {
      setVariableBlockIds(findAllVariableBlocks(interfaces));
    } else setVariableBlockIds([]);
  }, [interfaces, isOpen]);

  const toReturn = useMemo(() => {
    if (!interfaces) return undefined;
    if (!resources) return interfaces;

    return replaceVariableBlocksWithContent(interfaces, resources);
  }, [resources, interfaces]);

  return toReturn;
};

export default useInterfacesJsonDisplay;
