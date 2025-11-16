import Segment from '@/components/ui/Segment'
import { usePricingStore } from '../store/pricingStore'

const PaymentCycleToggle = () => {
    const { paymentCycle, setPaymentCycle } = usePricingStore()

    return (
        <Segment value={paymentCycle} onChange={(val) => setPaymentCycle(val)}>
            <Segment.Item value="monthly">Mensal</Segment.Item>
            <Segment.Item value="annually">Anual</Segment.Item>
        </Segment>
    )
}

export default PaymentCycleToggle
