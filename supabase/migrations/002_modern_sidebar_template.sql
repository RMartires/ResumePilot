-- Compact: single-column sans-serif with blue accents
update public.templates
set
  description = 'Clean sans-serif with blue accents and relaxed spacing.',
  config = '{"fontFamily":"Inter, system-ui, sans-serif","fontSize":"0.75rem","accentColor":"#2563eb","sectionSpacing":"18px","headingTransform":"none","layout":"standard"}'::jsonb
where slug = 'compact';

-- Modern: two-column green sidebar layout
update public.templates
set
  description = 'Two-column layout with sidebar for contact info.',
  config = '{"fontFamily":"Inter, system-ui, sans-serif","fontSize":"0.75rem","accentColor":"#2D9C6C","sectionSpacing":"18px","headingTransform":"uppercase","layout":"sidebar"}'::jsonb
where slug = 'modern';
