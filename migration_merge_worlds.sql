-- Migração de mundos: Serenian+Halorian -> Eldrian | Etherian+Divinian -> Obsidian
-- Grimoria I+III -> Drakaria | Grimoria II+IV -> Malveria
-- Rodar uma única vez no SQL Editor do Supabase.

-- 1) Itens
update public.items set server = 'Eldrian'  where server in ('Serenian','Halorian');
update public.items set server = 'Obsidian' where server in ('Etherian','Divinian');
update public.items set server = 'Drakaria' where server in ('Grimoria I','Grimoria III');
update public.items set server = 'Malveria' where server in ('Grimoria II','Grimoria IV');

-- 2) Contas
update public.accounts set server = 'Eldrian'  where server in ('Serenian','Halorian');
update public.accounts set server = 'Obsidian' where server in ('Etherian','Divinian');
update public.accounts set server = 'Drakaria' where server in ('Grimoria I','Grimoria III');
update public.accounts set server = 'Malveria' where server in ('Grimoria II','Grimoria IV');

-- 3) Coins
update public.coins set server = 'Eldrian'  where server in ('Serenian','Halorian');
update public.coins set server = 'Obsidian' where server in ('Etherian','Divinian');
update public.coins set server = 'Drakaria' where server in ('Grimoria I','Grimoria III');
update public.coins set server = 'Malveria' where server in ('Grimoria II','Grimoria IV');

-- 4) Lista de servidores salva em settings.data (jsonb) por usuário
update public.settings
set data = jsonb_set(
  data,
  '{servers}',
  (
    select jsonb_agg(distinct v)
    from (
      select case v
        when 'Serenian' then 'Eldrian'
        when 'Halorian' then 'Eldrian'
        when 'Etherian' then 'Obsidian'
        when 'Divinian' then 'Obsidian'
        when 'Grimoria I' then 'Drakaria'
        when 'Grimoria III' then 'Drakaria'
        when 'Grimoria II' then 'Malveria'
        when 'Grimoria IV' then 'Malveria'
        else v
      end as v
      from jsonb_array_elements_text(data->'servers') as v
    ) t
  )
)
where data ? 'servers';

-- 5) Contas loyalty (settings.data.loyaltyAccounts[].server), preservando 'Todos'
update public.settings
set data = jsonb_set(
  data,
  '{loyaltyAccounts}',
  (
    select jsonb_agg(
      case
        when elem->>'server' in ('Serenian','Halorian')       then jsonb_set(elem, '{server}', '"Eldrian"')
        when elem->>'server' in ('Etherian','Divinian')       then jsonb_set(elem, '{server}', '"Obsidian"')
        when elem->>'server' in ('Grimoria I','Grimoria III') then jsonb_set(elem, '{server}', '"Drakaria"')
        when elem->>'server' in ('Grimoria II','Grimoria IV') then jsonb_set(elem, '{server}', '"Malveria"')
        else elem
      end
    )
    from jsonb_array_elements(data->'loyaltyAccounts') as elem
  )
)
where data ? 'loyaltyAccounts' and jsonb_array_length(data->'loyaltyAccounts') > 0;
