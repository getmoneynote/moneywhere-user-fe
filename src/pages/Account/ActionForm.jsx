import {useEffect, useState} from "react";
import {useModel, useRequest} from '@umijs/max';
import {ProFormText, ProFormTextArea, ProFormSelect, ProFormSwitch} from '@ant-design/pro-components';
import {create, getAll, update} from '@/services/common';
import {amountRequiredRules, requiredRules} from "@/utils/rules";
import MyModalForm from '@/components/MyModalForm';
import t from '@/utils/i18n';

export default ({ type, actionRef }) => {

  const { action, currentRow, visible } = useModel('modal');
  const { initialState } = useModel('@@initialState');

  const { data : currencies = [], loading : currenciesLoading, run : loadCurrencies} = useRequest(() => getAll('currencies'), { manual: true });
  useEffect(() => {
    if (visible) {
      loadCurrencies();
    }
  }, [visible]);

  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    if (action === 1) {
      const initialValues = {
        include: true,
        canExpense: true,
        canIncome: true,
        canTransferFrom: true,
        canTransferTo: true,
        currencyCode: initialState.currentGroup.defaultCurrencyCode,
      }
      switch (type) {
        case 'CHECKING':
          setInitialValues(initialValues);
          break;
        case 'CREDIT':
          setInitialValues({
            ...initialValues,
            canIncome: false,
            canTransferFrom: false,
          });
          break;
        case 'ASSET':
          setInitialValues({
            ...initialValues,
            canExpense: false,
            canIncome: false,
          });
          break;
        case 'DEBT':
          setInitialValues({
            ...initialValues,
            canExpense: false,
            canIncome: false,
          });
          break;
      }
    } else if (action === 2) {
      // 数字类型的校验存在问题, antd bug
      if (currentRow.creditLimit) currentRow.creditLimit = currentRow.creditLimit.toString();
      setInitialValues({...currentRow});
    }
  }, [action, type, currentRow]);

  const successHandler = () => {
    actionRef.current?.reload();
  }

  const requestHandler = async (values) => {
    if (action === 1) {
      await create('accounts', { ...values, ...{ type: type } });
    } else if (action === 2) {
      await update('accounts', currentRow.id, values);
    }
  }

  const title = () => {
    let title = action === 1 ? t('add') : t('update');
    switch (type) {
      case 'CHECKING':
        return title + t('checking.account');
      case 'CREDIT':
        return title + t('credit.account');
      case 'ASSET':
        return title + t('asset.account');
      case 'DEBT':
        return title + t('debt.account');
    }
  }

  return (
    <>
      <MyModalForm
        title={title()}
        labelWidth={80}
        request={requestHandler}
        onSuccess={successHandler}
        initialValues={initialValues}
      >
        <ProFormSelect
          name="currencyCode"
          label={t('account.label.currencyCode')}
          rules={requiredRules()}
          fieldProps={{
            loading: currenciesLoading,
            options: currencies,
            showSearch: true,
            allowClear: false
          }}
        />
        <ProFormText
          name="name"
          label={t('label.name')}
          rules={requiredRules()}
        />
        <ProFormText
          disabled={action === 2}
          name="balance"
          label={t('account.label.balance')}
          rules={action !== 2 ? amountRequiredRules() : null}
        />
        {
          type === 'CREDIT' &&
          <ProFormText
            name="creditLimit"
            label={t('account.label.credit.limit')}
            rules={amountRequiredRules()}
          />
        }
        {
          type === 'DEBT' &&
          <ProFormText
            name="creditLimit"
            label={t('account.label.credit.limit')}
          />
        }
        {
          type === 'CREDIT' &&
          <ProFormSelect
            name="billDay"
            label={t('account.label.bill.day')}
            fieldProps={{
              options: Array(31).fill(0).map((_, i) => {return { label: i+1, value: i+1 }}),
              showSearch: true
            }}
          />
        }
        {
          type === 'DEBT' &&
          <ProFormSelect
            name="billDay"
            label={t('account.label.bill.day.debt')}
            fieldProps={{
              options: Array(31).fill(0).map((_, i) => {return { label: i+1, value: i+1 }}),
              showSearch: true
            }}
          />
        }
        {
          type === 'DEBT' &&
          <ProFormText
            name="apr"
            label={t('account.label.apr')}
          />
        }
        <ProFormText name="no" label={t('account.label.no')} />
        <ProFormSwitch name="canExpense" label={t('label.canExpense')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canIncome" label={t('label.canIncome')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canTransferFrom" label={t('account.label.canTransferFrom')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="canTransferTo" label={t('account.label.canTransferTo')} colProps={{ xl: 6 }} />
        <ProFormSwitch name="include" label={t('account.label.include')} />
        <ProFormTextArea name="notes" label={t('label.notes')} />
      </MyModalForm>
    </>
  );
}
