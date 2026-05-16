import {
  ProcessorState,
  useInvoiceProcessor,
} from '@/hooks/use-invoice-processor';
import { InvoiceResult } from '@/services/invoice.service';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

interface InvoiceProcessorContextValue {
  state: ProcessorState;
  process: (urls: string[]) => Promise<InvoiceResult[]>;
  dismiss: () => void;
}

const InvoiceProcessorContext = createContext<InvoiceProcessorContextValue>(
  {} as InvoiceProcessorContextValue
);

export const InvoiceProcessorProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useInvoiceProcessor();
  return (
    <InvoiceProcessorContext.Provider value={value}>
      {children}
    </InvoiceProcessorContext.Provider>
  );
};

export function useInvoiceProcessorContext() {
  return useContext(InvoiceProcessorContext);
}
